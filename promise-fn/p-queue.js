// ts写的, 去看github源码吧 https://github.com/sindresorhus/p-queue/tree/main/source


/**
import PQueue from 'p-queue';
import got from 'got';

const queue = new PQueue({concurrency: 1});

(async () => {
	await queue.add(() => got('https://sindresorhus.com'));
	console.log('Done: sindresorhus.com');
})();

(async () => {
	await queue.add(() => got('https://avajs.dev'));
	console.log('Done: avajs.dev');
})();

(async () => {
	const task = await getUnicornTask();
	await queue.add(task);
	console.log('Done: Unicorn task');
})();
 */