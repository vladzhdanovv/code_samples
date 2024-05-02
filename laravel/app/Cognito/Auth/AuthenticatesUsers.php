<?php

namespace App\Cognito\Auth;

use App\Cognito\CognitoUserService;
use App\Cognito\Exceptions\PasswordlessLoginFailed;
use App\Cognito\Exceptions\UserNotFoundException;
use App\Cognito\Guards\CognitoTokenGuard;
use App\Models\User;
use Aws\CognitoIdentityProvider\Exception\CognitoIdentityProviderException;
use Ellaisys\Cognito\AwsCognitoClaim;
use Ellaisys\Cognito\Exceptions\NoLocalUserException;
use Exception;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

trait AuthenticatesUsers
{
    use \Ellaisys\Cognito\Auth\AuthenticatesUsers;

    /**
     * Attempt to log the user into the application.
     *
     * @param  string  $guard (optional)
     * @param  string  $paramUsername (optional)
     * @param  string  $paramPassword (optional)
     * @param  bool  $isJsonResponse (optional)
     *
     * @throws ValidationException
     * @throws UserNotFoundException
     */
    protected function attemptLogin(
        Collection $request,
        string $guard = 'web',
        string $paramUsername = 'email',
        string $paramPassword = 'password',
        bool $isJsonResponse = false
    ): mixed {
        $rememberMe = $request->get('remember', false);

        $credentials = [
            'email' => $request[$paramUsername],
            'password' => $request[$paramPassword],
        ];

        try {
            $claim = Auth::guard($guard)->attempt($credentials, $rememberMe);
            if ($claim instanceof AwsCognitoClaim) {
                event(new Authenticated($guard, $claim->user));
            }
        } catch (NoLocalUserException $e) {
            if (config('cognito.add_missing_local_user_sso')) {
                $this->createLocalUser($credentials);

                return $this->attemptLogin($request, $guard, $paramUsername, $paramPassword, $isJsonResponse);
            }

            return $this->sendFailedLoginResponse($request, $e, $isJsonResponse, $paramUsername);
        } catch (CognitoIdentityProviderException $e) {
            return $this->sendFailedCognitoResponse($e, $isJsonResponse, $paramUsername);
        } catch (Exception $e) {
            return $this->sendFailedLoginResponse($request, $e, $isJsonResponse, $paramUsername);
        }

        return $claim;
    }

    /**
     * Attempt to log the user into the application by only a username.
     *
     * @throws Exception
     */
    protected function attemptPasswordlessLogin(User $user, $guard = 'api'): AwsCognitoClaim|bool
    {
        try {
            /** @var CognitoTokenGuard $cognitoTokenGuard */
            $cognitoTokenGuard = Auth::guard($guard);
            $claim = $cognitoTokenGuard->attemptPasswordless($user);

            event(new Authenticated('api', $user));
        } catch (\Throwable) {
            throw new PasswordlessLoginFailed('Login failed', 401);
        }

        return $claim;
    }

    /**
     * Create a local user if one does not exist.
     *
     * @param  array  $credentials
     *
     * @throws UserNotFoundException
     */
    protected function createLocalUser($credentials): User
    {
        return App::make(CognitoUserService::class)
            ->createLocalUser($credentials['email']);
    }
}
