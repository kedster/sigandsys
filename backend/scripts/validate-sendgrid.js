#!/usr/bin/env node

/**
 * SendGrid API Key Validation Script
 * 
 * This script helps validate your SendGrid API key configuration
 * Run with: node scripts/validate-sendgrid.js
 */

const API_KEY = process.env.SENDGRID_API_KEY;

async function validateSendGridKey() {
    console.log('🔍 Validating SendGrid API Key...\n');
    
    if (!API_KEY) {
        console.error('❌ SENDGRID_API_KEY environment variable not set');
        console.log('💡 Set it with: export SENDGRID_API_KEY=your_api_key_here');
        console.log('💡 Or create a .dev.vars file in the backend directory');
        process.exit(1);
    }
    
    console.log('✅ API key found in environment variables');
    console.log(`🔑 Key starts with: ${API_KEY.substring(0, 10)}...`);
    
    try {
        console.log('🌐 Testing API connection...');
        
        const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const profile = await response.json();
            console.log('✅ API key is valid!');
            console.log(`👤 Connected as: ${profile.email}`);
            console.log(`🏢 Company: ${profile.company || 'Not specified'}`);
            
            // Test marketing permissions
            console.log('\n🔍 Testing Marketing API access...');
            const marketingResponse = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (marketingResponse.ok) {
                console.log('✅ Marketing API access confirmed');
                console.log('🎉 SendGrid configuration is ready!');
            } else {
                console.log('⚠️  Marketing API access may be limited');
                console.log('💡 Ensure your API key has "Marketing" permissions');
            }
            
        } else {
            const errorText = await response.text();
            console.error('❌ API key validation failed');
            console.error(`Status: ${response.status}`);
            console.error(`Response: ${errorText}`);
            
            if (response.status === 401) {
                console.log('💡 Check that your API key is correct');
                console.log('💡 Generate a new key at: https://app.sendgrid.com/settings/api_keys');
            }
        }
        
    } catch (error) {
        console.error('❌ Failed to connect to SendGrid API');
        console.error(error.message);
        console.log('💡 Check your internet connection');
    }
}

if (require.main === module) {
    validateSendGridKey().catch(console.error);
}

module.exports = { validateSendGridKey };