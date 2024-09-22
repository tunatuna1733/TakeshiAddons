import settings from '../../settings';
import { getCurrentClass, inM7, inStorm } from '../../utils/dungeon';
import { registerWhen } from '../../utils/register';

registerWhen(
  register('chat', (name) => {
    if (
      inStorm() &&
      (getCurrentClass() === 'Healer' || getCurrentClass(name) === 'Berserk')
    ) {
      ChatLib.command(`pc [H]${Player.getName()} leaped to [B]${name}`);
    }
  }).setChatCriteria('You have teleported to ${name}!'),
  () => settings.healerleap && inM7(),
  { type: 'chat', name: 'Healer Leap' }
);
