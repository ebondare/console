import { execSync } from 'child_process';
import { browser } from 'protractor';
import {
  allNodes,
  allPvcs,
  allPvs,
  clusterHealth,
  clusterName,
  goToStorageDashboard,
  healthSubtitle,
  serviceName,
} from '../../views/storage-dashboard.view';
import { createNewPersistentVolumeClaim, deletePersistentVolumeClaim } from '../../views/pvc.view';
import { EXAMPLE_PVC, NS, OCP_HEALTH_ICON_COLORS, MINUTE } from '../../utils/consts';
import { scaleDeployment } from '../../utils/helpers';

const OCS_SERVICE_NAME = 'OpenShift Container Storage';

describe('Check data on Persistent Storage Dashboard.', () => {
  beforeAll(async () => {
    await goToStorageDashboard();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5 * MINUTE;
  });

  it('Check cluster is healthy', () => {
    expect([OCP_HEALTH_ICON_COLORS.GREEN, OCP_HEALTH_ICON_COLORS.GREEN46]).toContain(
      clusterHealth.getAttribute('fill'),
    );
  });

  it('Check service name is OCS', () => {
    expect(serviceName.getText()).toContain(OCS_SERVICE_NAME);
  });

  it('Check if cluster name is correct', async () => {
    const cephClusterName = execSync(
      "kubectl get storagecluster -n openshift-storage -o jsonpath='{.items..metadata.name}'",
    );
    expect(clusterName.getText()).toEqual(cephClusterName.toString().trim());
  });

  it('Check the total number of OCS nodes', async () => {
    const ocsNodesNumber = execSync(
      "kubectl get nodes -l cluster.ocs.openshift.io/openshift-storage -o json | jq '.items | length'",
    );
    expect(allNodes.getText()).toEqual(`${ocsNodesNumber.toString().trim()} Nodes`);
  });

  it('Check that number of PVCs is updated after successful PVC creation', async () => {
    const pvcsNumber = Number(allPvcs.getText());
    await createNewPersistentVolumeClaim(EXAMPLE_PVC, true);
    await goToStorageDashboard();
    const newPvcsNumber = Number(allPvcs.getText());
    await deletePersistentVolumeClaim(EXAMPLE_PVC.name, EXAMPLE_PVC.namespace);
    expect(newPvcsNumber).toEqual(pvcsNumber + 1);
  });

  it('Check that number of PVs is updated after successful PVC creation', async () => {
    await goToStorageDashboard();
    const pvsNumber = Number(allPvs.getText());
    await createNewPersistentVolumeClaim(EXAMPLE_PVC, true);
    await goToStorageDashboard();
    const newPvsNumber = Number(allPvs.getText());
    await deletePersistentVolumeClaim(EXAMPLE_PVC.name, EXAMPLE_PVC.namespace);
    expect(newPvsNumber).toEqual(pvsNumber + 1);
  });

  it('Check that OCS cluster changes to Warning status if an osd is down', async () => {
    await goToStorageDashboard();
    scaleDeployment('rook-ceph-osd-1', NS, '0');
    await browser.sleep(1 * MINUTE);
    expect(clusterHealth.getAttribute('fill')).toEqual(OCP_HEALTH_ICON_COLORS.YELLOW);
    expect(healthSubtitle.getText()).toEqual('Warning');
    scaleDeployment('rook-ceph-osd-1', NS, '1');
    await browser.sleep(1 * MINUTE);
  });
});
