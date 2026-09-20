/**
 * Cannoga College / University - SharePoint ClassHome Modernizer
 * 
 * Synchronizes course information, instructor profile, course announcements,
 * and quick links to the Microsoft 365 SharePoint Class Home Page (ClassHome.aspx).
 */

const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
  for (const k in envConfig) process.env[k] = envConfig[k];
}

async function getAppToken() {
  const res = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.AZURE_CLIENT_ID,
      client_secret: process.env.AZURE_CLIENT_SECRET,
      scope: 'https://graph.microsoft.com/.default'
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to acquire Azure AD token: ${res.statusText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function updateClassHome(options = {}) {
  const token = await getAppToken();
  const siteId = options.siteId || 'cannogacollege.sharepoint.com,e3b689d6-0569-497e-a45b-26e5760b3f0a,adbba7a7-6153-4cf3-8d88-39f0c13dabcf';
  const pageId = options.pageId || '7a285d33-f179-418a-a440-6563b2b2873f';

  console.log(`[SharePoint] Connecting to site: ${siteId}`);
  console.log(`[SharePoint] Updating page: ${pageId} (ClassHome.aspx)`);

  // 1. Text Announcement WebPart
  const textWpId = '00000000-0000-0000-0000-000000000002';
  const textHtml = options.announcementHtml || `
    <h2>Welcome to INF 1007: Infectious Disease Control</h2>
    <p>Welcome students! In this course, we will explore the principles of epidemiology, disease transmission dynamics, infection prevention protocols, and contemporary global outbreak management strategies. Please check announcements and the course schedule regularly.</p>
  `.trim();

  const textPatch = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitePage/webparts/${textWpId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      '@odata.type': '#microsoft.graph.textWebPart',
      'innerHtml': textHtml
    })
  });
  console.log(`[SharePoint] Announcement WebPart updated: ${textPatch.status}`);

  // 2. Instructor / People WebPart
  const peopleWpId = '00000000-0000-0000-0000-000000000005';
  const instructor = options.instructor || {
    name: 'Mbaike Chimezie',
    email: 'MbaikeChimezie@cannogacollege.onmicrosoft.com',
    role: 'Course Instructor',
    department: 'Faculty of Sciences',
    description: 'Instructor for INF 1007: Infectious Disease Control. Office hours and consultation available via Teams chat or email.'
  };

  const peoplePatch = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitePage/webparts/${peopleWpId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      '@odata.type': '#microsoft.graph.standardWebPart',
      'webPartType': '7f718435-ee4d-431c-bdbf-9c4ff326f46e',
      'data': {
        'dataVersion': '1.3',
        'title': 'People',
        'description': 'Display selected people and their profiles',
        'properties': {
          'layout': 2,
          'persons': [
            {
              'id': instructor.email,
              'role': instructor.role,
              'upn': instructor.email,
              'department': instructor.department
            }
          ]
        },
        'serverProcessedContent': {
          'htmlStrings': [],
          'searchablePlainTexts': [
            { 'key': 'title', 'value': 'Course Instructor' },
            { 'key': 'persons[0].name', 'value': instructor.name },
            { 'key': 'persons[0].email', 'value': instructor.email },
            { 'key': 'persons[0].description', 'value': instructor.description }
          ],
          'links': [],
          'imageSources': []
        }
      }
    })
  });
  console.log(`[SharePoint] Instructor People WebPart updated: ${peoplePatch.status}`);

  // 3. Quick Links WebPart
  const qlWpId = '00000000-0000-0000-0000-000000000003';
  const qlGetRes = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitePage/webparts/${qlWpId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (qlGetRes.ok) {
    const qlData = await qlGetRes.json();
    delete qlData['@odata.context'];
    delete qlData['id'];

    qlData.data.serverProcessedContent.searchablePlainTexts = [
      { key: 'title', value: 'Course Resources' },
      { key: 'items[0].title', value: 'Course Materials & Readings' },
      { key: 'items[1].title', value: 'Microsoft Teams Channel' }
    ];
    qlData.data.serverProcessedContent.links = [
      { key: 'baseUrl', value: '/sites/inf-1007-inf-1007-a-fall-2026' },
      { key: 'items[0].sourceItem.url', value: 'https://cannogacollege.sharepoint.com/sites/inf-1007-inf-1007-a-fall-2026/Class%20Materials' },
      { key: 'items[1].sourceItem.url', value: 'https://teams.microsoft.com/l/channel/19%3Ab0b64be8eeec473699b827e87ab09c4d%40thread.tacv2/General?groupId=6156e5df-4ee8-4a1d-b8d4-f6eb071bc85d&tenantId=7e6c5267-33e5-4228-a4aa-33e144ad3c1f' }
    ];

    const qlPatch = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitePage/webparts/${qlWpId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qlData)
    });
    console.log(`[SharePoint] Course Resources Quick Links updated: ${qlPatch.status}`);
  }

  // 4. Publish page
  const pubRes = await fetch(`https://graph.microsoft.com/v1.0/sites/${siteId}/pages/${pageId}/microsoft.graph.sitePage/publish`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(`[SharePoint] Page published: ${pubRes.status}`);

  return { success: true };
}

if (require.main === module) {
  updateClassHome()
    .then(() => console.log('Successfully synchronized SharePoint ClassHome page.'))
    .catch(err => {
      console.error('Error updating SharePoint ClassHome page:', err);
      process.exit(1);
    });
}

module.exports = { updateClassHome };
