load('api_mqtt.js');
load('api_timer.js');
load('api_sys.js');
load('api_bme280.js');
load('api_adc.js');
load('api_esp8266.js');
load('api_gpio.js');

ADC.enable(0);
GPIO.setup_output(4, 1);

// print('sleep 3');
// sleep(3);

let bmp = BME280.createI2C(0x76);

MQTT.setEventHandler(function (conn, ev, edata) {

    if (ev === MQTT.EV_CONNACK) {

        let data = {
            temp: bmp.readTemp(),
            press: bmp.readPress() / 133.322,
            adc: ADC.read(0)
        };

        print('data: ', JSON.stringify(data));

        MQTT.pub('weather/outside', JSON.stringify(data), 1);

        Timer.set(20000, Timer.REPEAT, function () {
            print('deepSleep: ', ESP8266.deepSleep(10 * 60 * 1000000));
        }, null);

    }
}, null);
