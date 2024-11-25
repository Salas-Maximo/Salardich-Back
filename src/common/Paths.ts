/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/',
    Add: '/',
    Login: '/login',
    Update: '/',
    Delete: '/:id',
  },
  Sanguches: {
    Base: '/sanguches',
    Get: '/',
    Add: '/',
    Update: '/',
    Delete: '/:id',
  },
} as const;
