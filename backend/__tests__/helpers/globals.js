import { execSync } from 'child_process';

global.beforeEach(() => {
  execSync("./__tests__/helpers/db_reset.sh");
});
