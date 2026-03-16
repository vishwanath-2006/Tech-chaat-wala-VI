import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=https:\/\/(.*)\.supabase\.co/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (urlMatch && keyMatch) {
    const urlRef = urlMatch[1];
    const key = keyMatch[1];
    const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString());
    const keyRef = payload.ref;

    console.log('URL Project Ref:', urlRef);
    console.log('JWT Project Ref:', keyRef);

    if (urlRef === keyRef) {
        console.log('SUCCESS: References match.');
    } else {
        console.log('ERROR: References do NOT match!');
        console.log('You might have a typo in your .env file.');
    }
} else {
    console.log('Could not find Supabase variables in .env');
}
