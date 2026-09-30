import { JwtModuleOptions } from '@nestjs/jwt';

export default (): JwtModuleOptions => ({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: Number(process.env.JWT_EXPIRES_IN) || 86400 },
});