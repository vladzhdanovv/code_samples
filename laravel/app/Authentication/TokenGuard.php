<?php

namespace App\Authentication;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;

class TokenGuard implements Guard
{
    protected $provider;

    protected $request;

    protected $user;

    public function __construct(UserProvider $provider, Request $request)
    {
        $this->provider = $provider;
        $this->request = $request;
        $this->user = null;
    }

    public function check(): bool
    {
        if ($this->hasUser()) {
            return true;
        }

        return $this->validate(['token' => $this->tryGetCurrentToken()]);
    }

    public function guest(): bool
    {
        return false;
    }

    public function user(): Authenticatable|null
    {
        return $this->user;
    }

    public function id(): int|string|null
    {
        if ($this->hasUser()) {
            return $this->user()->getAuthIdentifier();
        }

        return null;
    }

    public function validate(array $credentials = []): bool
    {
        if (empty($credentials['token'])) {
            return false;
        }

        $user = $this->provider->retrieveByCredentials($credentials);

        if (! empty($user) && $this->provider->validateCredentials($user, $credentials)) {
            $this->setUser($user);

            return true;
        }

        return false;
    }

    public function hasUser(): bool
    {
        return ! is_null($this->user);
    }

    public function setUser(Authenticatable $user): void
    {
        $this->user = $user;
    }

    /**
     * Gets the current token from headers.
     * If the token is not set in the headers, returns null.
     */
    private function tryGetCurrentToken(): string|null
    {
        return $this->request->header('X-Application-Token', null);
    }
}
