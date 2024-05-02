<?php

namespace App\Nova\Actions;

use App\Services\LoginTokenService;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Http\Requests\NovaRequest;

class LogIntoAccount extends Action
{
    use InteractsWithQueue, Queueable;

    /**
     * Perform the action on the given models.
     *
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        $user = $models->first();

        /** @var LoginTokenService $loginTokenService */
        $loginTokenService = App::make(LoginTokenService::class);

        $token = $loginTokenService->create($user);

        $redirectUrl = sprintf(
            config('app.spa_login_with_token_url'),
            $token
        );

        return Action::openInNewTab($redirectUrl);
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [];
    }
}
