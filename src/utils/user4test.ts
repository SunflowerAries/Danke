// import { StorageService } from '../storage/storage.service';
// import { saltHashPassword } from './salt';
// import { exit } from 'process';

// async function main() {
//   const storage = new StorageService();
//   await storage.query(`INSERT INTO user(name, email, saltedPassword) VALUES('test', 'test@fudan.edu.cn', ?)`, [
//     saltHashPassword('test'),
//   ]);
//   exit();
// }
// main();
