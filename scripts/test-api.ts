import { api } from '../src/api';

async function test() {
    try {
        console.log('Testing Verify...');
        const verified = await api.verifyAccess('1234');
        console.log('Verified:', verified);

        console.log('Testing Create...');
        const newPrompt = {
            id: 'test_' + Date.now(),
            title: 'Test Prompt',
            description: 'Test Description',
            content: 'Test Content',
            tags: ['TEST'],
            createdAt: new Date().toISOString(),
        };
        const created = await api.createPrompt(newPrompt);
        console.log('Created:', created);

        console.log('Testing Fetch...');
        const prompts = await api.fetchPrompts();
        console.log('Prompts:', prompts);

    } catch (error) {
        console.error('Error:', error);
    }
}

test();
