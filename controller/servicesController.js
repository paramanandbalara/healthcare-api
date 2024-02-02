const ServiceModel = require('../models/ServiceModel');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writeFileAsync = promisify(fs.writeFile);

class ServiceController {
    static async getAllServices(req, res) {
        try {
            const services = await ServiceModel.getAllServices();
            const updated = await Promise.all(services.map(getThumbnails))
            // console.log(updated)
            return res.status(200).json(updated);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }

    static async getServiceById(req, res) {
		const serviceId = req.params.id;
		try {
			const services = await ServiceModel.getServiceById(serviceId);

			if (!services.length) {
				return res.status(404).json({ error: 'Service not found.' });
			}
			// const localServiceImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'services', String(serviceId));

			// Get the list of image names (excluding thumbnails)
			// const imageNames = fs.readdirSync(localServiceImagesPath).filter(e => e.includes('thumbnail'));

			// Get the download links for each image
			// const serviceImages = await Promise.all(imageNames.map(imageName => getServiceImages(serviceId, imageName)));
			const updated = await Promise.all(services.map(getThumbnails))
			return res.status(200).json(updated);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' + error });
		}
	}
    static async addService(req, res) {
        const serviceData = req.body;
        const serviceImages = req.files;
        // console.log(serviceImages,'add prod')
        try {

            const result = await ServiceModel.addService(serviceData);

            if (!!result) {
                const serviceId = result; // Assuming result is the inserted service ID

                // Create a directory for the service's images if it doesn't exist
                const serviceImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'services', String(serviceId));
                if (!fs.existsSync(serviceImagesPath)) {
                    fs.mkdirSync(serviceImagesPath);
                }

                // Iterate through the uploaded files and save them locally
                await Promise.all(serviceImages.map(async (file) => {
                    const filePath = path.join(serviceImagesPath, file.originalname);
                    await writeFileAsync(filePath, file.buffer);
                }));
            }
            // console.log(result,'insertId');
            return res.status(201).json({ message: 'Service added successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }

    static async updateService(req, res) {
        const serviceId = req.params.id;
        const updatedServiceData = req.body;
        const serviceImages = req.files;

        try {
            const result = await ServiceModel.updateService(serviceId, updatedServiceData);
            if (!result) {
                return res.status(404).json({ error: 'Service not found.' });
            }
            if (serviceImages.length) {
                const serviceImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'services', String(serviceId));
                if (!fs.existsSync(serviceImagesPath)) {
                    fs.mkdirSync(serviceImagesPath);
                }

                // Iterate through the uploaded files and save them locally
                await Promise.all(serviceImages.map(async (file) => {
                    await removeExistingImages(serviceImagesPath,file.originalname);
                    const filePath = path.join(serviceImagesPath, file.originalname);
                    await writeFileAsync(filePath, file.buffer);
                }));
            }
            return res.status(200).json({ message: 'Service updated successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }
    static async deleteService(req, res) {
        const serviceId = req.params.id;

        try {
            // Call your ServiceModel to delete the service from the database
            const deletedService = await ServiceModel.deleteService(serviceId);

            if (!deletedService) {
                return res.status(404).json({ error: 'Service not found.' });
            }

            // Delete the files in the saved directory
            const serviceImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'services', String(serviceId));

            // Get the list of all files in the directory
            const files = fs.readdirSync(serviceImagesPath);

            // Delete each file
            files.forEach((file) => {
                const filePath = path.join(serviceImagesPath, file);
                fs.unlinkSync(filePath);
                console.log(`Deleted file: ${filePath}`);
            });

            return res.status(200).json({ message: 'Service deleted successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }

    //service request functions

    static async addServiceRequest(req, res){
        const serviceRequestData = req.body;
        try {

            const result = await ServiceModel.addServiceRequest(serviceRequestData);
            
            return res.status(201).json({ message: 'Service request added successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }
    static async getServiceRequests(req, res) {
        try {
            const service_requests = await ServiceModel.getServiceRequests();
            // console.log(updated)
            return res.status(200).json(service_requests);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }
    static async getServiceRequestsByUser(req, res) {
        try {
            const { userId } = req.query;
            const service_requests = await ServiceModel.getServiceRequestsByUser(userId);
            // console.log(updated)
            return res.status(200).json(service_requests);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }

    //remarks
    static async addServiceRequestRemark(req, res){
        const serviceRequestData = req.body;
        try {

            const result = await ServiceModel.addServiceRequestRemark(serviceRequestData);
            
            return res.status(201).json({ message: 'Remark added successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }
    static async getServiceRequestRemarks(req, res) {
        try {
            const service_request_id = req.query.sr
            const service_requests = await ServiceModel.getServiceRequestRemarks(service_request_id);
            // console.log(updated)
            return res.status(200).json(service_requests);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' + error });
        }
    }
}

async function removeExistingImages(img_path, img_name) {
	try {
		const files = fs.readdirSync(img_path);
		const existingFiles = files.filter(e => e.includes(img_name.split('.')[0]));

		await existingFiles.forEach(e => {
			const filePath = path.join(img_path, e);
			fs.unlinkSync(filePath);
		});
	} catch (error) {
		console.error(error);
	}
}

async function getThumbnails(service) {
    try {
        const localImagesPath = path.join(__dirname, '..', '..', 'homoeopatha-images', 'services', String(service.id));

        // Get the list of image names (excluding thumbnails)
        const imageNames = fs.readdirSync(localImagesPath).filter(e => e.includes('thumbnail'));
        if (!imageNames.length) {
            return service
        }
        const imageBuffer = fs.readFileSync(path.join(localImagesPath, imageNames[0]));
        const base64Image = imageBuffer.toString('base64');
        service['thumbnail'] = base64Image;
        return service

    } catch (error) {
        console.error(error)
    }
}

module.exports = ServiceController