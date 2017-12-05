export default function (injected) {
    const qs = injected("qs");
    const createHistory = injected("createHistory");

    function CurrentGameTracker() {

        const history = createHistory();

        return {
            joined: function () {
                const currentSearch = qs.parse(window.location.search);
                return currentSearch.gameId !== "";
            },
            gameId: function () {
                const currentSearch = qs.parse(window.location.search);
                return currentSearch.gameId
            },
            join: function (gameId) {
                const currentSearch = qs.parse(window.location.search);
                currentSearch.gameId = gameId;

                history.push({
                    pathname: '/',
                    search: qs.stringify(currentSearch)
                })
            },
            leave: function () {
                const currentSearch = qs.parse(window.location.search);
                currentSearch.gameId = undefined;
                history.push({
                    pathname: '/',
                    search: qs.stringify(currentSearch)
                })
            }
        }
    }

    return CurrentGameTracker()
};