import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DropsignService } from './dropsign.service';

@Controller('api/dropsign')
export class DropsignController {
  constructor(private readonly dropsignService: DropsignService) {}

  @Post()
  async sendSignatureRequest(@Body() body: any) {
    const { participants, file } = body;

    // Validate participants
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      throw new HttpException('Participants are required', HttpStatus.BAD_REQUEST);
    }

    // Validate file
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
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
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
