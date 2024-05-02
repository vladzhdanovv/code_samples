<?php

namespace App\Repositories\Interfaces;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;

interface UserRepositoryInterface extends BaseMethodsRepositoryInterface
{
    /**
     * Find by email.
     *
     * @throws ModelNotFoundException
     */
    public function findByEmail(string $email): User;

    /**
     * Find by email or cognito username.
     *
     * @throws ModelNotFoundException
     */
    public function findByEmailOrCognitoUsername(string $email, string $cognitoUsername): User;

    public function findByAppToken(string $moderatorAppToken): User;
}
