import Evint from "../model/evintmodel.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import { get } from "http";
const createEvint = async (req, res) => {
    try {
        const { title, description,createdBy, date, time, location,organizer } = req.body;
        if (!title || !description || !createdBy || !date || !time || !location||!organizer) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const thublenail = {
            publicId: "defaultPublicId",
            secureUrl: "defaultSecureUrl"
        };
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: "lms",
            });
            if (result) {
                thublenail.publicId = result.public_id;
                thublenail.secureUrl = result.secure_url;
            }
            fs.rm(`temprare/${req.file.filename}`);
        }
        const newEvent = await Evint.create({
            title,
            description,
            createdBy,
            thublenail,
            date,
            time,
            location,
            organizer
        });
        res.status(201).json({
            message: "Event created successfully",
            event: newEvent,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
    }

  const  getEvint = async (req, res) => {
    try {
        const events = await Evint.find({});
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }
        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
    }
export { createEvint, getEvint };