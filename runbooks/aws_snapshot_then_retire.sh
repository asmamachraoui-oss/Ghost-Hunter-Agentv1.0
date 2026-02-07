
#!/bin/bash
# Ghost-Hunter AWS Runbook
RESOURCE_ID=$1
REGION=$2

echo "Creating EBS Snapshot..."
SNAP_ID=$(aws ec2 create-snapshot --volume-id $RESOURCE_ID --region $REGION --query 'SnapshotId' --output text)

echo "Waiting for completion..."
aws ec2 wait snapshot-completed --snapshot-ids $SNAP_ID --region $REGION

if [ $? -eq 0 ]; then
    echo "Retiring volume..."
    aws ec2 delete-volume --volume-id $RESOURCE_ID --region $REGION
else
    echo "Snapshot failed. Aborting."
    exit 1
fi
