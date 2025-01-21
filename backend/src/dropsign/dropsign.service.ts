import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DropsignEntity } from './dropsign.entity';
import { createSignatureRequest } from './helpers/signature.helper';

@Injectable()
export class DropsignService {
  constructor(
    @InjectRepository(DropsignEntity)
    private dropsignRepository: Repository<DropsignEntity>,
  ) {}

  async createSignatureRequest({ participants, base64Content }: any) {
    try {
      const result = await createSignatureRequest({ participants, base64Content });

      // Save the document details to the database
      const newDocument = this.dropsignRepository.create({
        title: 'Please sign this agreement',
        subject: 'Agreement Signing Request',
        message: 'Please sign this document to proceed.',
        participants,
        status: 'pending',
        fileContent: base64Content,
      });

      await this.dropsignRepository.save(newDocument);

      return result;
    } catch (error) {
      console.error('Error in DropsignService:', error.message);
      throw new Error(error.message);
    }
  }
}
