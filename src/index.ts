import { IDevice, DeviceFactory, IReferenceValues } from './factory';

type evaluateLogFileResults = { [key: string]: string };
export async function evaluateLogFile(logContents: string): Promise<evaluateLogFileResults> {
  const logLines = logContents.split('\n');
  const [reference, ...deviceLines] = logLines;
  const [_, referenceTemp, referenceHumidity, referencePPM] = reference.split(' ');
  const referenceValues: IReferenceValues = {
    temperature: parseFloat(referenceTemp),
    humidity: parseFloat(referenceHumidity),
    monoxide: parseFloat(referencePPM),
  };

  const devices: IDevice[] = [];
  deviceLines.map((line) => {
    if (DeviceFactory.isDeviceLine(line)) {
      const [type, name] = line.split(' ');
      try {
        const device = DeviceFactory.createDevice(type, name, referenceValues);
        devices.push(device);
      } catch (e) {
        console.log(`Error creating device "${name}" of type "${type}"`);
      }
    } else {
      devices[devices.length - 1].addValue(parseFloat(line.split(' ')[1]));
    }
  });

  return devices.reduce((retVal, device) => {
    retVal[device.name] = device.getQuality();
    return retVal;
  }, {});
}
