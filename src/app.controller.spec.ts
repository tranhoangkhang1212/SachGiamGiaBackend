import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
