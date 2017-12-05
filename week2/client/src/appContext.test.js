import appContextModule from  'appContext';
import fakeIoModule from '_test/fakeIo';

describe('app context initialization', function () {

    it('should load app context without throwing', function () {
        const io = fakeIoModule();
        appContextModule(inject({
            io,
            env:"test"
        }));

        //TODO Assert on io messages emitted when bootstrapping client.

    });

});