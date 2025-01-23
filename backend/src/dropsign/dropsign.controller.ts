import { Controller, Post, Body, HttpException } from '@nestjs/common';
import { DropsignService } from './dropsign.service';

@Controller('api/dropsign')
export class DropsignController {
  constructor(private readonly dropsignService: DropsignService) {}

  @Post()
  async sendSignatureRequest(@Body() body: any) {
    const { participants, file } = body;

    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      throw new HttpException('Participants are required', 400);  
    }

    // Validate file
    if (!file) {
      throw new HttpException('File is required', 400);  
    }

    try {
      const result = await this.dropsignService.createSignatureRequest({
        participants,
        base64Content: file,
      });

      return { message: 'Signature request sent successfully', result };
    } catch (error) {
      console.error('Error in sendSignatureRequest:', error.message);
      throw new HttpException(
        `Error sending signature request: ${error.message}`,
        500,  
      );
    }
  }
}
