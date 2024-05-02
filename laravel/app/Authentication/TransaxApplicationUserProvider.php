<?php

namespace App\Authentication;

use Illuminate\Auth\GenericUser;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use RuntimeException;

class TransaxApplicationUserProvider implements UserProvider
{
    /**
     * Retrieve Application by the provided application token.
     *
     * @param  string  $identifier
     */
    public function retrieveById(mixed $identifier): Authenticatable|null
    {
        if (! $this->validateApplicationToken($identifier)) {
            return null;
        }

        return new GenericUser([
            'id' => $identifier,
        ]);
    }

    /**
     * Remember token is not supported.
     *
     * @param  mixed  $identifier
     * @param  string  $token
     * @return Authenticatable|null
     *
     * @throws RuntimeException
     */
    public function retrieveByToken($identifier, $token)
    {
        throw new RuntimeException('Not implemented');
    }

    /**
     * Remember token is not supported.
     *
     * @param  string  $token
     * @return void
     *
     * @throws RuntimeException
     */
    public function updateRememberToken(Authenticatable $user, $token)
    {
        throw new RuntimeException('Not implemented');
    }

    /**
     * Retrieve Application by the provided credentials (token).
     *
     * @param  array<string,mixed>  $credentials
     */
    public function retrieveByCredentials(array $credentials): Authenticatable|null
    {
        if (empty($credentials['token']) || ! $this->validateApplicationToken($credentials['token'])) {
            return null;
        }

        return new GenericUser([
            'id' => $credentials['token'],
        ]);
    }

    /**
     * Validate Application credentials (token) are valid and match the $user object.
     *
     * @param  array<string,mixed>  $credentials
     */
    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        return ! empty($credentials['token']) && $this->validateApplicationToken($credentials['token']) && $credentials['token'] === $user->getAuthIdentifier();
    }

    /**
     * Validate Application token.
     * Check that is exists in the config.
     */
    private function validateApplicationToken(string $applicationToken): bool
    {
        $transaxTokens = config('auth.transax_tokens');

        return in_array($applicationToken, $transaxTokens);
    }
}
