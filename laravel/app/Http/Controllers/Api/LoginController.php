<?php

namespace app\Http\Controllers\Api;

use App\Cognito\Auth\AuthenticatesUsers;
use App\Cognito\Exceptions\RefreshTokenFailedException;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\LoginWithTokenRequest;
use App\Http\Requests\RefreshTokenRequest;
use App\Http\Resources\V1\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Services\LoginTokenService;
use Ellaisys\Cognito\Auth\RefreshToken;
use Ellaisys\Cognito\AwsCognitoClaim;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use function App\Http\Controllers\Api\V1\collect;
use function App\Http\Controllers\Api\V1\event;
use function App\Http\Controllers\Api\V1\response;

class LoginController extends Controller
{
    use AuthenticatesUsers,
        RefreshToken;

    /**
     * Handle a login attempt.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = collect([
            'email' => $request->email,
            'password' => $request->password,
        ]);

        try {
            $claim = $this->attemptLogin(
                $credentials,
                'api',
                'email',
                'password',
                true
            );

            if (! $claim instanceof AwsCognitoClaim) {
                throw new \Exception($claim ?: 'Authentication failed');
            }

            /** @var User $user */
            $user = Auth::user();

            if ($user->role->name !== Role::ROLE_moderator) {
                throw new \Exception(
                    sprintf('This authentication method does not support role \'%s\'', $user->role->name)
                );
            }
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
            ], 401);
        }

        $data = $claim->getData();

        return $this->respondWithToken($user, $data['AccessToken'], $data['RefreshToken']);
    }

    /**
     * Handle a login with token attempt.
     */
    public function loginWithToken(LoginWithTokenRequest $request, LoginTokenService $loginTokenService): JsonResponse
    {
        try {
            $user = $loginTokenService->redeem($request->token);

            if ($user->role->name !== Role::ROLE_moderator) {
                throw new \Exception(
                    sprintf('This authentication method does not support role \'%s\'', $user->role->name)
                );
            }

            $claim = $this->attemptPasswordlessLogin($user);
        } catch (\Throwable) {
            return response()->json([
                'message' => 'The provided login token is invalid.',
            ], 401);
        }

        $data = $claim->getData();

        return $this->respondWithToken($user, $data['AccessToken'], $data['RefreshToken']);
    }

    /**
     * Log the user out of the application.
     */
    public function logout(): JsonResponse
    {
        Auth::logout();

        return response()->json([], 204);
    }

    /**
     * Refresh token.
     */
    public function refreshToken(RefreshTokenRequest $request, UserRepositoryInterface $userRepository): JsonResponse
    {
        try {
            $data = $this->refresh($request);

            if (! is_array($data)) {
                throw new RefreshTokenFailedException();
            }

            $user = $userRepository->findByEmail($request->email);

            event(new Authenticated('api', $user));
        } catch (\Throwable $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'access_token' => $data['AccessToken'],
            'refresh_token' => $data['RefreshToken'],
        ]);
    }

    /**
     * Build the response.
     */
    protected function respondWithToken(User $user, string $accessToken, string $refreshToken): JsonResponse
    {
        return response()->json([
            'user' => new UserResource($user),
            'OAuth' => [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
            ],
        ]);
    }
}
