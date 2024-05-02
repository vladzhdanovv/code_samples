<?php

namespace App\Cognito\Auth;

use Ellaisys\Cognito\AwsCognitoClient;
use Ellaisys\Cognito\Exceptions\InvalidUserFieldException;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;

trait RegistersUsers
{
    use \Ellaisys\Cognito\Auth\RegistersUsers;

    /**
     * Handle a registration request for the application.
     *
     * @throws InvalidUserFieldException
     */
    public function createCognitoUser(Collection $collection, array $clientMetadata = null, string $groupName = null): bool
    {
        $attributes = [];

        $messageAction = config('cognito.new_user_message_action', null);

        $isUserEmailForcedVerified = config('cognito.force_new_user_email_verified', false);

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

        $email = $collection->get('email');
        $password = $collection->get('password');

        return App::make(AwsCognitoClient::class)
            ->inviteUser(
                $email,
                $password,
                $attributes,
                $clientMetadata,
                $messageAction,
                $isUserEmailForcedVerified,
                $groupName
            );
    }
}
