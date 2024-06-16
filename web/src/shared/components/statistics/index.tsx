import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Typography, Button, Modal, Form, Input, Select } from 'antd';
import styled from '@emotion/styled';
import SectionLayout from '../layouts/SectionLayout';
import { Point } from '#/shared/utils/type';
import LoadingScreen from '../common/LoadingScreen';
import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { fetchAllPoints, updateBin } from '#/api/point';
import { ColumnsType } from 'antd/es/table';
import { showError, showSuccess } from '@enouvo/react-uikit';

const StyledTable = styled(Table<Point>)`
  .ant-table {
    .ant-table {
      border: 1px solid var(--scroll-bar);
      &-body {
        max-height: calc(100vh - 17.4rem) !important;
      }
    }
  
    @media (max-width: 768px) {
      .ant-table {
        border: none !important;
        &-thead {
          tr {
            &:first-child {
              border-bottom-left-radius: 0.5rem !important;
            }import value from '../../../vite-env.d';

          }
        }
      }
    }
  `;

const columns: ColumnsType<Point> = [
  {
    title: 'ID',
    dataIndex: '_id',
    key: '_id',
    sorter: (a, b) => a._id.localeCompare(b._id),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Latitude',
    dataIndex: 'lat',
    key: 'lat',
    sorter: (a, b) => a.lat - b.lat,
  },
  {
    title: 'Longitude',
    dataIndex: 'lng',
    key: 'lng',
    sorter: (a, b) => a.lng - b.lng,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    render: status => {
      return <span>{status === '1' ? 'Full' : 'Not full'}</span>;
    },
  },
  {
    title: 'Ultrasonic Distance 1',
    dataIndex: 'ultraSonicDistance1',
    key: 'ultraSonicDistance1',
    sorter: (a, b) =>
      Number(a.ultraSonicDistance1) - Number(b.ultraSonicDistance1),
  },
  {
    title: 'Ultrasonic Distance 2',
    dataIndex: 'ultraSonicDistance2',
    key: 'ultraSonicDistance2',
    sorter: (a, b) =>
      Number(a.ultraSonicDistance2) - Number(b.ultraSonicDistance2),
  },
  {
    title: 'Actions',
    key: 'actions',
    render: (text, record) => <UpdateBinButton record={record} />,
  },
];

interface UpdateBinButtonProps {
  record: Point;
}

const UpdateBinButton: React.FC<UpdateBinButtonProps> = ({ record }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTypeSafeTranslation();
  const { refetch } = useQuery<Point[]>(['points'], fetchAllPoints);

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleCloseModal = () => {
    setVisible(false);
  };

  const handleUpdate = (values: Point) => {
    updateBin(values)
      .then(() => {
        showSuccess('Bin updated successfully');
        setVisible(false);
        refetch(); // Refetch points data
      })
      .catch(error => {
        console.error('Error updating bin:', error);
        showError('Failed to update bin');
      });
  };

  return (
    <>
      <Button type="link" onClick={handleOpenModal}>
        Edit
      </Button>
      <UpdateBinFormModal
        visible={visible}
        initialValues={record}
        onCancel={handleCloseModal}
        onUpdate={handleUpdate}
      />
    </>
  );
};

interface UpdateBinFormModalProps {
  visible: boolean;
  initialValues: Point;
  onCancel: () => void;
  onUpdate: (values: Point) => void;
}

const UpdateBinFormModal: React.FC<UpdateBinFormModalProps> = ({
  visible,
  initialValues,
  onCancel,
  onUpdate,
}) => {
  const { t } = useTypeSafeTranslation();
  const [form] = Form.useForm();

  const handleFinish = (values: Point) => {
    const { _id, ...updatedValues } = values;

    onUpdate({ _id, ...updatedValues, id: _id });

    // Reset form fields after update
    form.resetFields();
  };

  return (
    <Modal title="Edit Bin" visible={visible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
        <Form.Item name="lat" label="Latitude">
          <Input />
        </Form.Item>
        <Form.Item name="lng" label="Longitude">
          <Input />
        </Form.Item>
        <Form.Item name="_id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            optionLabelProp="label"
            options={[
              { label: 'Not Full', value: 0 },
              { label: 'Full', value: 1 },
            ]}
          >
            <Select.Option value={0}>Not Full</Select.Option>
            <Select.Option value={1}>Full</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

function StatsContainer() {
  const { t } = useTypeSafeTranslation();
  const refetchInterval = 3000; // 3 seconds

  const { data: points = [], isLoading } = useQuery<Point[]>(
    ['points'], // Query key
    fetchAllPoints, // Fetch function
    {
      refetchInterval, // Refetch interval
    },
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SectionLayout isEmpty={false}>
      <Typography.Title level={3}>Bins Statistic</Typography.Title>
      <div className="p-4">
        <Typography.Title level={4}>
          Total bins: {points.length}
        </Typography.Title>

        <StyledTable columns={columns} dataSource={points} rowKey="id" />
      </div>
    </SectionLayout>
  );
}

export default StatsContainer;
