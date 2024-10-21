const handler11 = (data) => {
  const processedData = data.toString().split('').reverse().join('');
  return Buffer.from(processedData);
};

export default handler11;
