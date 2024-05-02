<?php

namespace App\Nova;

use App\Nova\Actions\ChangePassword;
use App\Nova\Traits\CreatesCognitoUser;
use App\Nova\Traits\UpdatesCognitoUser;
use Ellaisys\Cognito\Exceptions\InvalidUserFieldException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\Rules;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    use CreatesCognitoUser,
        UpdatesCognitoUser;

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\User>
     */
    public static $model = \App\Models\User::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'name', 'email',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            ID::make()->sortable(),

            Text::make('Email')
                ->sortable()
                ->rules('required', 'email', 'max:254')
                ->creationRules('unique:users,email')
                ->updateRules('unique:users,email,{{resourceId}}'),

            Text::make('Password')
                ->onlyOnForms()
                ->hideWhenUpdating()
                ->creationRules('required', Rules\Password::defaults()),

            Text::make('First Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Last Name')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Phone Number')
                ->rules('required', 'numeric', 'digits_between:9,11'),
        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @return array
     */
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [
            ChangePassword::make()->showInline()->showOnDetail()->showOnIndex(),
        ];
    }

    /**
     * Register a callback to be called after the resource is created.
     *
     * @return void
     *
     * @throws InvalidUserFieldException
     */
    public static function afterCreate(NovaRequest $request, Model $model)
    {
        self::createCognitoUser($request, $model);
    }

    /**
     * Register a callback to be called after the resource is updated.
     *
     * @return void
     */
    public static function afterUpdate(NovaRequest $request, Model $model)
    {
        self::updateCognitoUser($model);
    }
}
