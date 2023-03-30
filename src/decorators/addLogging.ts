export function addLogging(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments: `, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result of ${propertyKey}: `, result);
    return result;
  };

  return descriptor;
}