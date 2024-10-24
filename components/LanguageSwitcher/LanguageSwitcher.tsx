import React, { useState } from "react";
import { Modal, Button, List } from "antd";
import { GrLanguage } from "react-icons/gr";

interface Language {
  code: string;
  name: string;
}

interface LanguageSwitcherProps {
  languages: Language[];
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  languages,
  currentLanguage,
  onSelectLanguage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="text" onClick={showModal} icon={<GrLanguage />} />
      <Modal
        title="Select Language"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={languages}
          renderItem={(language) => (
            <List.Item
              onClick={() => {
                onSelectLanguage(language.code);
                setIsModalOpen(false);
              }}
              style={{
                cursor: "pointer",
                backgroundColor:
                  language.code === currentLanguage ? "#f0f0f0" : "transparent",
              }}
            >
              <List.Item.Meta
                title={language.name}
                description={
                  language.code === currentLanguage ? "Currently selected" : ""
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default LanguageSwitcher;
