
export default function(injected){
    const createHistory = injected("createHistory");
    const qs = injected("qs");

    function currentUserTracker() {
        const history = createHistory();

        return {
            getUserId: function () {
                const currentSearch = qs.parse(window.location.search);
                return currentSearch.userId
            },
            setUserId: function (userId) {
                const currentSearch = qs.parse(window.location.search);
                currentSearch.userId = userId;

                history.push({
                    pathname: '/',
                    search: qs.stringify(currentSearch)
                })
            }
        }
    }
    return currentUserTracker();
};