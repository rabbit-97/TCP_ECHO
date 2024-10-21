const handler10 = (data) => {
  const processedData = data.toString().toUpperCase();
  return Buffer.from(processedData);
};

export default handler10;
