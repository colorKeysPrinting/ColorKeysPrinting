
 # Locations

    main app: `client/apps/sibi_ge_admin/`
        actions     - `client/apps/sibi-ge-admin/actions/`
            - note: api calls follow the format
                Network - `client/libs/constants/network`
            ```
            {
                type   : ActionTypes.`<action type>`,
                method : Network.`GET|POST|PUT|DEL|PATCH`,
                url    : `${Network.DOMAIN}/<api call>`,
                headers: {},
                body   : {}
            }
            ```
        actionTypes - `client/apps/sibi-ge-admin/constants/action_types`
            - note: inside of action_types there is 2 sections regular action calls and asyncronus action calls.
                    Make sure any network calls are placed in the asyncronus section, these actions are appended
                    with a `_DONE` so in your reducers you can place an action with `ActionTypes.<action>_DONE:`
                    this will have an `action.payload` that you can access the returned data.
        components  - `client/apps/sibi-ge-admin/components/`
        reducers    - `client/apps/sibi-ge-admin/reducers/`

        assets - any image file you add to `client/apps/sibi-ge-admin/assets/images` will get loaded into the project.
                    You can access the images by importing the module from `client/apps/sibi-ge-admin/libs/assets` and adding
                    an image tag `<img src={assets('./image/<name of img>.(png|jpg)')} />`
    webpack config - `client/config/webpack.config.js`
