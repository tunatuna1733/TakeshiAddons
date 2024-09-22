import { registerWhen } from '../../utils/register';

const EntityMagmaCube = Java.type(
  'net.minecraft.entity.monster.EntityMagmaCube'
);

registerWhen(register('renderWorld', () => {}));
