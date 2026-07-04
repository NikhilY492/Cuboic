import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<
    Pick<UsersService, 'findByUserId' | 'updatePassword' | 'update'>
  >;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign'>>;

  const mockUser = {
    id: 'user-uuid-1',
    user_id: 'john.doe',
    password_hash: '', // set per-test via bcrypt.hash
    name: 'John Doe',
    role: 'Manager' as const,
    restaurantId: 'rest-1',
    email: 'john@example.com',
    phone: '+91999',
    image_url: null,
    dashboard_config: ['Pending', 'Preparing'],
    outlet: null,
    outletId: null,
    is_active: true,
    customRoleId: null,
    failedLoginAttempts: 0,
    lockUntil: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    usersService = {
      findByUserId: jest.fn(),
      updatePassword: jest.fn(),
      update: jest.fn(),
    } as any;
    jwtService = { sign: jest.fn().mockReturnValue('mock.jwt.token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: AuditService, useValue: { logAction: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // ── validateUser ────────────────────────────────────────────────────────
  describe('validateUser', () => {
    it('returns the user when credentials are correct', async () => {
      const hash = await bcrypt.hash('secret123', 10);
      usersService.findByUserId.mockResolvedValue({
        ...mockUser,
        password_hash: hash,
      });

      const result = await service.validateUser('john.doe', 'secret123');
      expect(result).toMatchObject({ id: 'user-uuid-1' });
    });

    it('returns null when the user does not exist', async () => {
      usersService.findByUserId.mockResolvedValue(null);
      const result = await service.validateUser('nobody', 'anything');
      expect(result).toBeNull();
    });

    it('returns null when the password is wrong', async () => {
      const hash = await bcrypt.hash('correct-pass', 10);
      usersService.findByUserId.mockResolvedValue({
        ...mockUser,
        password_hash: hash,
      });

      const result = await service.validateUser('john.doe', 'wrong-pass');
      expect(result).toBeNull();
    });
  });

  // ── login ───────────────────────────────────────────────────────────────
  describe('login', () => {
    it('returns an access_token and user object', () => {
      const result = service.login(mockUser);
      expect(result.access_token).toBe('mock.jwt.token');
      expect(result.user.id).toBe('user-uuid-1');
      expect(result.user.role).toBe('Manager');
    });

    it('resolves restaurantId from direct field', () => {
      const result = service.login({
        ...mockUser,
        restaurantId: 'rest-direct',
      });
      expect(result.user.restaurantId).toBe('rest-direct');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({ restaurantId: 'rest-direct' }),
      );
    });

    it('resolves restaurantId from outlet when not direct', () => {
      const user = {
        ...mockUser,
        restaurantId: null,
        outlet: { restaurantId: 'rest-via-outlet' },
      };
      const result = service.login(user);
      expect(result.user.restaurantId).toBe('rest-via-outlet');
    });

    it('restaurantId is null when neither direct nor outlet is set', () => {
      const user = { ...mockUser, restaurantId: null, outlet: null };
      const result = service.login(user);
      expect(result.user.restaurantId).toBeNull();
    });

    it('JWT payload includes sub, userId, role, restaurantId', () => {
      service.login(mockUser);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-1',
        userId: 'john.doe',
        role: 'Manager',
        restaurantId: 'rest-1',
      });
    });
  });

  // ── changePassword ──────────────────────────────────────────────────────
  describe('changePassword', () => {
    it('successfully changes password with correct old password', async () => {
      const hash = await bcrypt.hash('old-pass', 10);
      usersService.findByUserId.mockResolvedValue({
        ...mockUser,
        password_hash: hash,
      });
      usersService.updatePassword.mockResolvedValue({ ...mockUser } as any);

      await service.changePassword('john.doe', 'old-pass', 'StrongP@ss1');

      expect(usersService.updatePassword).toHaveBeenCalledWith(
        'user-uuid-1',
        expect.stringMatching(/^\$2[aby]\$/), // bcrypt hash pattern
      );
    });

    it('throws UnauthorizedException when old password is incorrect', async () => {
      const hash = await bcrypt.hash('correct-pass', 10);
      usersService.findByUserId.mockResolvedValue({
        ...mockUser,
        password_hash: hash,
      });

      await expect(
        service.changePassword('john.doe', 'wrong-old', 'StrongP@ss1'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
