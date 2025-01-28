import settings from '../../settings';
import { getCurrentArea, getCurrentZone } from '../../utils/area';
import { registerWhen } from '../../utils/register';

registerWhen(
  register('step', () => {
    if (getCurrentZone().includes('The Garden') && getCurrentZone().includes('x')) {
      const amount = Number.parseInt(getCurrentZone().match(/\d/g)[0]);
      if (amount === 4) {
        Client.showTitle('&c-5%!!!', '', 0, 4 * 20, 0);
        Client.showTitle('&c-5%!!!', '', 0, 4 * 20, 0);
      } else if (amount === 5) {
        Client.showTitle('&c-15%!!!', '', 0, 4 * 20, 0);
        Client.showTitle('&c-15%!!!', '', 0, 4 * 20, 0);
      } else if (amount === 6) {
        Client.showTitle('&c-30%!!!', '', 0, 4 * 20, 0);
        Client.showTitle('&c-30%!!!', '', 0, 4 * 20, 0);
      } else if (amount === 7) {
        Client.showTitle('&c-50%!!!', '', 0, 4 * 20, 0);
        Client.showTitle('&c-50%!!!', '', 0, 4 * 20, 0);
      } else if (amount >= 8) {
        Client.showTitle('&c-75%!?!?!?', '', 0, 4 * 20, 0);
        Client.showTitle('&c-75%!?!?!?', '', 0, 4 * 20, 0);
      }
    }
  }).setDelay(3),
  () => settings.pesttitle && getCurrentArea() === 'Garden',
  { type: 'step', name: 'Pest Title' },
);
