<?php

namespace App\Services;

use App\Exceptions\LoginTokenInvalid;
use App\Models\LoginToken;
use App\Models\User;
use App\Repositories\Interfaces\LoginTokenRepositoryInterface;
use Illuminate\Support\Str;

class LoginTokenService
{
    public const TYPE_DISPOSABLE = 'disposable';

    public const TYPE_REUSABLE = 'reusable';

    /**
     * LoginTokenService constructor.
     */
    public function __construct(
        private LoginTokenRepositoryInterface $loginTokenRepository
    ) {
        //
    }

    /**
     * Create a login token.
     */
    public function create(User $user, bool $reusable = false): string
    {
        /** @var LoginToken $token */
        $token = $this->loginTokenRepository->create([
            'user_id' => $user->id,
            'type' => $reusable ? self::TYPE_REUSABLE : self::TYPE_DISPOSABLE,
            'token' => Str::uuid(),
        ]);

        return $token->token;
    }

    /**
     * Redeem a login token.
     *
     * @throws LoginTokenInvalid
     */
    public function redeem(string $token): User
    {
        try {
            $token = $this->loginTokenRepository->findByToken($token);

            if ($token->type === self::TYPE_DISPOSABLE) {
                $this->loginTokenRepository->delete($token->id);
            }
        } catch (\Throwable $e) {
            throw new LoginTokenInvalid();
        }

        return $token->user;
    }
}
