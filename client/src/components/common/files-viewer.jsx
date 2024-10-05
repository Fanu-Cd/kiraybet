import { Col, Flex, Image, Row } from "antd";

const FilesViewer = ({ filePaths }) => {
  console.log("file", filePaths);

  const finalFilePaths = filePaths?.map(
    (file) => `http://localhost:3001/${file?.replaceAll("\\\\", "/")}`
  );
  return (
    <div className="w-full">
      <Row gutter={10} className="w-full">
        {finalFilePaths?.map((item) => (
          <Col span={4}>
            <Image
              src={item}
              width={"100%"}
              height={"100%"}
              className="bg-orange-300"
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FilesViewer;
