<?php

namespace App\Repositories;

use App\Models\Role;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Traits\HasBaseMethodsTrait;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserRepository implements UserRepositoryInterface
{
    use HasBaseMethodsTrait;

    /**
     * UserRepository constructor.
     */
    public function __construct(
        private User $model
    ) {
        //
    }

    /**
     * Find by email.
     *
     * @throws ModelNotFoundException
     */
    public function findByEmail(string $email): User
    {
        return $this->model
            ->where('email', $email)
            ->firstOrFail();
    }

    /**
     * Find by email or cognito username.
     *
     * @throws ModelNotFoundException
     */
    public function findByEmailOrCognitoUsername(string $email, string $cognitoUsername): User
    {
        return $this->model
            ->where('email', $email)
            ->orWhere('cognito_username', $cognitoUsername)
            ->firstOrFail();
    }

    /**
     * Find by moderator app token
     *
     * @throws ModelNotFoundException
     */
    public function findByAppToken(string $moderatorAppToken): User
    {
        $moderatorRole = Role::getByName(Role::ROLE_moderator);

        return $this->model
            ->where('role_id', $moderatorRole->id)
            ->whereHas('moderatorshipDetail', function ($query) use ($moderatorAppToken) {
                $query->where('app_token', $moderatorAppToken);
            })
            ->firstOrFail();
    }
}
