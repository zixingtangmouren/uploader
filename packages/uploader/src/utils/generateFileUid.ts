export function generateFileUid(file: File) {
  // 获取文件的基础信息
  const fileName = file.name;
  const lastModified = file.lastModified;
  const size = file.size;

  const fileInfoString = JSON.stringify({ fileName, lastModified, size });

  const simpleHash = fileInfoString.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  // 将哈希值转换为字符串（可选的格式处理）
  const uid = simpleHash.toString(16);

  // 返回UID
  return uid;
}
