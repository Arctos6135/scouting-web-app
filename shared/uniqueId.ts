export default function uniqueID() {
	const nums = new Uint32Array(4);
	crypto.getRandomValues(nums);
	return Array.from(nums).map(n => n.toString(16).padStart(8, '0')).join('');
}