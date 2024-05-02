<?php

namespace App\Cognito\Auth;

use App\Cognito\Exceptions\PasswordUpdateFailedException;
use Ellaisys\Cognito\AwsCognitoClient;
use Ellaisys\Cognito\Exceptions\InvalidUserFieldException;
use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Password;

trait UpdatesUsers
{
    /**
     * Handle a registration request for the application.
     *
     * @throws InvalidUserFieldException
     * @throws BindingResolutionException
     */
    public function updateCognitoUser(string $username, Collection $collection): bool
    {
        $attributes = [];

        $userFields = config('cognito.cognito_user_fields');

        foreach ($userFields as $key => $userField) {
            if ($collection->has($userField)) {
                $attributes[$key] = $collection->get($userField);
            } else {
                throw new InvalidUserFieldException("The configured user field {$userField} is not provided in the request.");
            }
        }

        $userFields = config('cognito.cognito_user_optional_fields');

        foreach ($userFields as $key => $userField) {
            if ($collection->has($userField)) {
                $attributes[$key] = $collection->get($userField);
            }
        }

        return App::make(AwsCognitoClient::class)
            ->setUserAttributes(
                $username,
                $attributes
            );
    }

    /**
     * Handle a password update request for the application.
     *
     * @throws PasswordUpdateFailedException
     */
    public function updateCognitoUserPassword(string $username, string $password): bool
    {
        $result = App::make(AwsCognitoClient::class)
            ->setUserPassword(
                $username,
                $password
            );

        if ($result !== Password::PASSWORD_RESET) {
            throw new PasswordUpdateFailedException($result);
        }

        return true;
    }
}
