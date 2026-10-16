import { test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import handler from '../api/bookings.mjs';
import { createBookingHandler } from '../lib/bookings.mjs';

const valid = { name: 'Test', email: 'test@example.com', message: 'A website for our business.', service: 'Web Development', plan: 'Growth', website: '' };
function response() {
  return { status: 0, headers: {}, setHeader(k,v) { this.headers[k]=v; }, writeHead(status,headers) { this.status=status; Object.assign(this.headers,headers); }, end(body) { this.data=JSON.parse(body); } };
}
test('Vercel entry point handles a request without starting a standalone listener', async () => {
  const server = http.createServer(handler);
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  try {
    const result = await fetch(`http://127.0.0.1:${server.address().port}/api/bookings`);
    assert.equal(result.status,405);
    assert.equal(result.headers.get('allow'),'POST');
  } finally { await new Promise(resolve => server.close(resolve)); }
});
test('preparsed Vercel JSON retains validation, delivery, and size limits', async () => {
  let calls=0;
  const run=createBookingHandler({env:{RESEND_API_KEY:'test',RESEND_FROM_EMAIL:'test@example.com',BOOKING_TO_EMAIL:'test@example.com'},send:async()=>{calls++;return Response.json({id:'mock'});}});
  for (const body of [valid,JSON.stringify(valid),Buffer.from(JSON.stringify(valid))]) {
    const res=response();
    await run({method:'POST',headers:{'content-type':'application/json'},body},res);
    assert.equal(res.status,200);
  }
  assert.equal(calls,3);
  for (const [body,status] of [[{...valid,email:'bad'},422],[{...valid,message:'x'.repeat(17000)},413],['{',400]]) {
    const res=response();
    await run({method:'POST',headers:{'content-type':'application/json'},body},res);
    assert.equal(res.status,status);
  }
  assert.equal(calls,3);
});
