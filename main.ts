//% color=#ff4b4b icon="\uf2db" block="KSRobot_Sensor"
namespace KSRobot_Sensor {

    let initialized = false;
    let Weight_Maopi =0;
    let flow_water_val = 0;

    export enum Sensor_Version {
        Version1 = 0,
        Version2 = 1,

    }


    export enum DHT_type {
        //% blockId="DHT11" block="DHT11"
        DHT11,
        //% blockId="DHT22" block="DHT22"
        DHT22,
    }

    export enum DHT_State {
        //% blockId="Celsius" block="Celsius"
        Celsius,
        //% blockId="Fahrenheit" block="Fahrenheit"
        Fahrenheit,
        //% blockId="Humidity" block="Humidity"
        Humidity,
    }

    export enum SOIL_State {
        //% blockId="Celsius" block="Celsius"
        Celsius,
        //% blockId="Humidity" block="Humidity"
        Humidity,
    }

    export enum Wind_Direction_State {
        //% blockId="North_wind" block="North"
        North = 0,
        //% blockId="Northeast_wind" block="Northeast"
        Northeast = 1,
        //% blockId="East_wind" block="East"
        East = 2,
        //% blockId="Southeast_wind" block="Southeast"
        Southeast = 3,
        //% blockId="South_wind" block="South"
        South = 4,
        //% blockId="Southwest_wind" block="Southwest"
        Southwest = 5,
        //% blockId="West_wind" block="West"
        West = 6,
        //% blockId="Northwest_wind" block="Northwest"
        Northwest = 7,
        

    }



    //% blockId="KSRobot_dht11" block="DHT set %dht_type pin %dataPin|get %dht_state"
    export function dht_readdata(dht_type: DHT_type, dataPin: DigitalPin, dht_state: DHT_State): number {
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        let checksum: number = 0
        let checksumTmp: number = 0
        let _temperature: number = -999.0
        let _humidity: number = -999.0
        let _readSuccessful: boolean = false

        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)

        pins.digitalWritePin(dataPin, 0)
        basic.pause(18)
        pins.setPull(dataPin, PinPullMode.PullUp);
        pins.digitalWritePin(dataPin, 1)
        control.waitMicros(40)
        pins.digitalReadPin(dataPin)

        if (pins.digitalReadPin(dataPin) != 1) {
            while (pins.digitalReadPin(dataPin) == 1);
            while (pins.digitalReadPin(dataPin) == 0);
            while (pins.digitalReadPin(dataPin) == 1);
            //read data (5 bytes)
            for (let index = 0; index < 40; index++) {
                while (pins.digitalReadPin(dataPin) == 1);
                while (pins.digitalReadPin(dataPin) == 0);
                control.waitMicros(28)
                //if sensor still pull up data pin after 28 us it means 1, otherwise 0
                if (pins.digitalReadPin(dataPin) == 1) dataArray[index] = true
            }

            //convert byte number array to integer
            for (let index = 0; index < 5; index++)
                for (let index2 = 0; index2 < 8; index2++)
                    if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

            //verify checksum
            checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
            checksum = resultArray[4]
            if (checksumTmp >= 512) checksumTmp -= 512
            if (checksumTmp >= 256) checksumTmp -= 256
            if (checksum == checksumTmp) _readSuccessful = true

            //read data if checksum ok
            if (_readSuccessful) {
                if (dht_type == DHT_type.DHT11) {
                    //DHT11
                    _humidity = resultArray[0] + resultArray[1] / 100
                    _temperature = resultArray[2] + resultArray[3] / 100
                } else {
                    //DHT22
                    let temp_sign: number = 1
                    if (resultArray[2] >= 128) {
                        resultArray[2] -= 128
                        temp_sign = -1
                    }
                    _humidity = (resultArray[0] * 256 + resultArray[1]) / 10
                    _temperature = (resultArray[2] * 256 + resultArray[3]) / 10 * temp_sign
                }
                switch (dht_state) {
                    case DHT_State.Celsius:

                        return _temperature;
                        break;

                    case DHT_State.Fahrenheit:

                        return _temperature = _temperature * 9 / 5 + 32;
                        break;

                    case DHT_State.Humidity:

                        return _humidity;
                        break;

                }
            }

        }

        return -99;

    }


    //% blockId="KSRobot_soil" block="Soil pin %dataPin|get %soil_state"
    export function soil_readdata(dataPin: DigitalPin, soil_state: SOIL_State): number {
        let dataArray: boolean[] = []
        let resultArray: number[] = []
        let checksum: number = 0
        let checksumTmp: number = 0
        let _temperature: number = -999.0
        let _humidity: number = -999.0
        let _readSuccessful: boolean = false

        for (let index = 0; index < 40; index++) dataArray.push(false)
        for (let index = 0; index < 5; index++) resultArray.push(0)

        pins.digitalWritePin(dataPin, 0)
        basic.pause(18)
        pins.setPull(dataPin, PinPullMode.PullUp);
        pins.digitalWritePin(dataPin, 1)
        control.waitMicros(40)
        pins.digitalReadPin(dataPin)

        if (pins.digitalReadPin(dataPin) != 1) {
            while (pins.digitalReadPin(dataPin) == 1);
            while (pins.digitalReadPin(dataPin) == 0);
            while (pins.digitalReadPin(dataPin) == 1);
            //read data (5 bytes)
            for (let index = 0; index < 40; index++) {
                while (pins.digitalReadPin(dataPin) == 1);
                while (pins.digitalReadPin(dataPin) == 0);
                control.waitMicros(28)
                //if sensor still pull up data pin after 28 us it means 1, otherwise 0
                if (pins.digitalReadPin(dataPin) == 1) dataArray[index] = true
            }

            //convert byte number array to integer
            for (let index = 0; index < 5; index++)
                for (let index2 = 0; index2 < 8; index2++)
                    if (dataArray[8 * index + index2]) resultArray[index] += 2 ** (7 - index2)

            //verify checksum
            checksumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3]
            checksum = resultArray[4]
            if (checksumTmp >= 512) checksumTmp -= 512
            if (checksumTmp >= 256) checksumTmp -= 256
            if (checksum == checksumTmp) _readSuccessful = true

            //read data if checksum ok
            if (_readSuccessful) {

                _humidity = resultArray[0] + resultArray[1] / 100
                _temperature = resultArray[2] + resultArray[3] / 100

                switch (soil_state) {
                    case SOIL_State.Celsius:

                        return _temperature;
                        break;

                    case SOIL_State.Humidity:

                        return _humidity;
                        break;

                }
            }

        }

        return -99;

    }

    //% blockId="KSRobot_temt6000" block="TEMT6000(Lux) set pin %dataPin"
    export function temt6000(dataPin: AnalogPin): number {
        let temp = pins.analogReadPin(dataPin)
        return (Math.round(temp * 4 / 1024 / 10000 * 1000000 * 4))
    }


    function HX711_Read(sck_pin: DigitalPin, data_pin: DigitalPin): number {

        // gain 128


        //digitalWrite(HX711_DT, HIGH);
        //delayMicroseconds(1);
        pins.digitalWritePin(data_pin, 1)
        control.waitMicros(1)

        //digitalWrite(HX711_SCK, LOW);
        //delayMicroseconds(1);
        pins.digitalWritePin(sck_pin, 0)
        control.waitMicros(1)

        //count = 0;
        let count = 0;

        //while (digitalRead(HX711_DT));
        while (pins.digitalReadPin(data_pin));

        //for (i = 0; i < 24; i++) {
        for (let i = 0; i < 24; i++) {
            //digitalWrite(HX711_SCK, HIGH);
            //delayMicroseconds(1);
            pins.digitalWritePin(sck_pin, 1)
            control.waitMicros(1)

            //count = count << 1;
            count = count * 2;

            //digitalWrite(HX711_SCK, LOW);
            //delayMicroseconds(1);
            pins.digitalWritePin(sck_pin, 0)
            control.waitMicros(1)

            //if (digitalRead(HX711_DT))
            //    count++;

            if (pins.digitalReadPin(data_pin))
                count += 1

        }


        //digitalWrite(HX711_SCK, HIGH);
        //count ^= 0x800000;  
        //delayMicroseconds(1);
        pins.digitalWritePin(sck_pin, 1)
        count = count ^ 0x800000;
        control.waitMicros(1)
        //digitalWrite(HX711_SCK, LOW);
        //delayMicroseconds(1);
        pins.digitalWritePin(sck_pin, 0)
        control.waitMicros(1)


        return (count);
    }


    //% blockId="KSRobot_load_cell" block="Load Cell(g) set ClockPin %sck_pin |DataPin %data_pin "
    export function load_cell(sck_pin: DigitalPin, data_pin: DigitalPin): number {


        let Weight = 0;
        let HX711_Buffer =0;

        //Get_Maopi()
        if (!initialized) {
            HX711_Buffer = HX711_Read(sck_pin, data_pin);
            Weight_Maopi = HX711_Buffer / 100;
            basic.pause(1000)
            HX711_Buffer = HX711_Read(sck_pin, data_pin);
            Weight_Maopi = HX711_Buffer / 100;

            initialized = true;

        }

        //Get_Weight()
        HX711_Buffer = HX711_Read(sck_pin, data_pin);
        HX711_Buffer = HX711_Buffer / 100;

        let Weight_Shiwu = HX711_Buffer;
        Weight_Shiwu = Weight_Shiwu - Weight_Maopi;
        Weight = Math.round(Weight_Shiwu / 2.14);


        return Weight
        
    }

    //% blockId="KSRobot_wind_speed" block="Wind Sensor(m/s) Version %version | set pin %dataPin"
    export function wind_speed(version:Sensor_Version , dataPin: AnalogPin): number {
        let temp = pins.analogReadPin(dataPin);
        switch (version) {
            case Sensor_Version.Version1:
                
                return (temp * 4 / 1024 * 26);
                break;
            case Sensor_Version.Version2:
               
                return (temp / 1024 * 5 * 6);
                break;
        }

            

    }
    //% blockId="KSRobot_wind_direction" block="Wind Sensor set pin %dataPin"
    export function wind_direction(dataPin: AnalogPin): number {
        let temp = pins.analogReadPin(dataPin);
        if(temp<50)
            
        {
            return Wind_Direction_State.North;
        }
        else if(temp<200)
        {
            return Wind_Direction_State.Northeast;
        }
        else if(temp<350)
        {
            return Wind_Direction_State.East;
        }
        else if(temp<480)
        {
            return Wind_Direction_State.Southeast;
        }
        else if(temp<620)
        {
            return Wind_Direction_State.South;
        }
        else if(temp<760)
        {
            return Wind_Direction_State.Southwest;
        }
        else if(temp<900)
        {
            return Wind_Direction_State.West;
        }
        else(temp<1024)
        {
            return Wind_Direction_State.Northwest;
        }

    }


    //% blockId="KSRobot_wind_direction_val" block="Wind Direction %wind_dir_state"
    export function wind_direction_val(wind_dir_state: Wind_Direction_State): number {
        return wind_dir_state;
    }
    
    function flow_sensor_read(iopin: DigitalPin): void {

        let temp = 0
        let plus_flag = 0
        let plus_cnt = 0
        control.inBackground(function () {
            while (true) {
                temp = pins.digitalReadPin(iopin)
                if (temp== 1 && plus_flag == 0) {
                    plus_flag = 1
                    plus_cnt += 1
                    flow_water_val = plus_cnt / 450
                }
                if (temp == 0 && plus_flag == 1) {
                    plus_flag = 0
                }
                basic.pause(2)
               
            }
        })

    }

    //% blockId="KSRobot_flow_sensor_init" block="Water Flow Sensor Set pin %dataPin"
    export function flow_sensor_init(dataPin: DigitalPin): void {
        flow_sensor_read(dataPin)
        
    }

    
    //% blockId="KSRobot_read_flow_sensor" block="Read Water Flow Sensor(L）"
    export function read_flow_sensor(): number {
        return flow_water_val
    
    }
    //% blockId="KSRobot_dissolved_oxygen" block=" Dissolved oxygen(mg/L) set pin %dataPin temperature %tempPin"
    export function dissolved_oxygen(dataPin: AnalogPin, tempPin: DigitalPin): number {
        let DO = 0 
        let VREF = 5000    
        let ADC_RES = 1023 

        let CAL1_V = 5000 //mV
        let CAL1_T = 25   //C
        let CAL2_V = 1300 //mV
        let CAL2_T = 15   //C

        let DO_Table = [
            14460, 14220, 13820, 13440, 13090, 12740, 12420, 12110, 11810, 11530,
            11260, 11010, 10770, 10530, 10300, 10080, 9860, 9660, 9460, 9270,
            9080, 8900, 8730, 8570, 8410, 8250, 8110, 7960, 7820, 7690,
            7560, 7430, 7300, 7180, 7070, 6950, 6840, 6730, 6630, 6530, 6410
        ]


        let temperature_c = Math.round(dstemp.celsius(tempPin))
        let ADC_Raw = pins.analogReadPin(dataPin);
        let ADC_Voltage = (VREF) * ADC_Raw / ADC_RES;

        let V_saturation =  (CAL1_V - CAL2_V)*(temperature_c - CAL2_T) / (CAL1_T - CAL2_T) + CAL2_V;
        DO = (ADC_Voltage * DO_Table[temperature_c] / V_saturation);



        if( DO<=0 )
            { DO=0; }
        if( DO>=20000 )
            { DO=20000; }


        return DO
    }

    //% blockId="KSRobot_CO2_readdata" block="CO2(ppm) TXD %txd| RXD %rxd"
    export function CO2_readdata(txd: SerialPin, rxd: SerialPin): number {
        let co2 = 0
        let rowData: Buffer = null
        let myBuff = pins.createBuffer(10);
        let dataArr = [
            255,
            1,
            134,
            0,
            0,
            0,
            0,
            0,
            121
            ]
        serial.redirect(
            txd,   //TX
            rxd,  //RX
            BaudRate.BaudRate9600
        );
        serial.setRxBufferSize(10)
        serial.setTxBufferSize(10)
        
        for (let i = 0; i <= 8; i++) {
            myBuff.setNumber(NumberFormat.UInt8BE, i, dataArr[i])
        }
        serial.writeBuffer(myBuff)
        basic.pause(100)
        rowData = serial.readBuffer(0)
        if (rowData.length > 8) {
            if (rowData[1] == 134) {
                co2 = 256 * rowData[2] + rowData[3]
            
            }
        }

        return co2
    }




}
