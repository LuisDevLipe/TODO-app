function idGenerator() {
	const random = () => Math.floor(Math.random() * 1000);
	const timestamp = new Date().getTime();
	const id = timestamp * random();
	return id;
}
export { idGenerator };