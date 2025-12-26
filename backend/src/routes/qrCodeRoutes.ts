import { Router } from 'express';
import { QRCodeController } from '../controllers/qrCodeController';
import { authenticate } from '../middleware/auth';

const router = Router();
const qrCodeController = new QRCodeController();

router.post('/preview', (req, res) => qrCodeController.previewQRCode(req, res));

router.use(authenticate);

router.post('/', (req, res) => qrCodeController.createQRCode(req, res));
router.get('/', (req, res) => qrCodeController.getQRCodes(req, res));
router.get('/:id', (req, res) => qrCodeController.getQRCodeById(req, res));
router.put('/:id', (req, res) => qrCodeController.updateQRCode(req, res));
router.delete('/:id', (req, res) => qrCodeController.deleteQRCode(req, res));

export default router;
