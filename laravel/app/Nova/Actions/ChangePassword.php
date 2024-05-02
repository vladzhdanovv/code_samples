<?php

namespace App\Nova\Actions;

use App\Nova\Traits\UpdatesCognitoUser;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\ActionFields;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class ChangePassword extends Action
{
    use InteractsWithQueue,
        Queueable,
        UpdatesCognitoUser;

    /**
     * Perform the action on the given models.
     *
     * @return mixed
     */
    public function handle(ActionFields $fields, Collection $models)
    {
        $user = $models->first();

        self::updateCognitoUserPassword(
            $user,
            $fields['password']
        );

        return Action::message('Password successfully changed!');
    }

    /**
     * Get the fields available on the action.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            Text::make('New password', 'password'),
        ];
    }
}
