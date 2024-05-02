<?php

namespace App\Services;

use App\Cognito\CognitoUserService;
use App\Cognito\Exceptions\NeitherPasswordNorCognitoUsernameProvidedException;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Interfaces\ModeratorshipDetailRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class UserService
{
    /**
     * UserService constructor.
     */
    public function __construct(
        private UserRepositoryInterface $userRepository,
    ) {
        //
    }

    /**
     * Create a new user.
     *
     * @throws NeitherPasswordNorCognitoUsernameProvidedException
     */
    public function createUser(string $email, Role $role, array $userData = [], array $relations = []): User
    {
        if (empty($userData['password']) && empty($userData['cognito_username'])) {
            throw new NeitherPasswordNorCognitoUsernameProvidedException();
        }

        $userData['email'] = $email;
        $userData['role_id'] = $role->id;

        return DB::transaction(function () use ($userData, $relations) {
            /** @var User $user */
            $user = $this->userRepository->create($userData);

            if (isset($relations['moderatorship'])) {
                $moderatorshipDetailRepository = App::make(ModeratorshipDetailRepositoryInterface::class);

                $moderatorshipDetailRepository->create([
                    'moderator_id' => $user->id,
                    'name' => $relations['moderatorship']['name'],
                    'is_active' => true,
                ]);
            }

            if (! $user->cognito_username) {
                $user->cognito_username = App::make(CognitoUserService::class)->createUser(
                    $user,
                    $userData['password']
                );

                $user->save();
            }

            return $user;
        });
    }

    /**
     * Update the user.
     */
    public function updateUser(
        User $user,
        Role $role,
        array $userData = [],
        array $relations = [],
        bool $updateCognito = true
    ): User {
        $userData['role_id'] = $role->id;

        $userDataToUpdate = [];
        foreach ($userData as $key => $value) {
            if (isset($user->{$key}) && $user->{$key} !== $value) {
                $userDataToUpdate[$key] = $value;
            }
        }

        $userRelationsToUpdate = [];
        foreach ($relations as $key => $value) {
            if ($key === 'moderatorship') {
                if ($user->moderatorshipDetail->name !== $value['name']) {
                    $userRelationsToUpdate[$key] = $value;
                }
            }
        }

        if (! count($userDataToUpdate) && ! count($userRelationsToUpdate)) {
            return $user;
        }

        return DB::transaction(function () use ($user, $userDataToUpdate, $userRelationsToUpdate, $updateCognito) {
            if (count($userDataToUpdate)) {
                $this->userRepository->update($user->id, $userDataToUpdate);
            }

            if (count($userRelationsToUpdate)) {
                if (isset($userRelationsToUpdate['moderatorship'])) {
                    App::make(ModeratorshipDetailRepositoryInterface::class)
                        ->update($user->moderatorshipDetail->id, [
                            'name' => $userRelationsToUpdate['moderatorship']['name'],
                        ]);
                }
            }

            $user->refresh();

            if ($updateCognito) {
                App::make(CognitoUserService::class)
                    ->updateUser($user);
            }

            return $user;
        });
    }

    /**
     * Change user password.
     */
    public function changePassword(User $user, string $password): void
    {
        App::make(CognitoUserService::class)->updateUserPassword(
            $user,
            $password
        );
    }
}
