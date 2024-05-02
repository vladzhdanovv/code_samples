<?php

namespace App\Nova\Controllers;

use App\Cognito\Auth\AuthenticatesUsers;
use App\Cognito\Exceptions\UserNotFoundException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Laravel\Nova\Nova;

class LoginController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Handle a login request to the application.
     *
     *
     * @throws ValidationException
     * @throws UserNotFoundException
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = collect([
            'email' => $request->email,
            'password' => $request->password,
        ]);

        $guardName = config('nova.guard');

        if ($this->attemptLogin($credentials, $guardName)) {
            $request->session()->regenerate();
            $request->session()->put('auth.password_confirmed_at', time());

            return redirect()->intended(
                Nova::url(Nova::$initialPath)
            );
        }

        return $this->sendFailedLoginResponse($request);
    }
}
