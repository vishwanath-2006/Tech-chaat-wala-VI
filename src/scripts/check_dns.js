import dns from 'dns';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const payloadRaw = Buffer.from(key.split('.')[1], 'base64').toString();
const payload = JSON.parse(payloadRaw);

console.log('--- JWT Analysis ---');
console.log('Raw Payload:', payloadRaw);
console.log('Project Ref in JWT:', payload.ref);

console.log('\n--- DNS Lookups ---');
const urls = [
    'obiemtgabajulunalpqc.supabase.co',
    'obiemtgabhejlunalpqc.supabase.co',
    'obiemtgabhejalunalpqc.supabase.co'
];

urls.forEach(url => {
    dns.lookup(url, (err, address) => {
        if (err) {
            console.log(`❌ ${url}: NOT FOUND`);
        } else {
            console.log(`✅ ${url}: ${address}`);
        }
    });
});
