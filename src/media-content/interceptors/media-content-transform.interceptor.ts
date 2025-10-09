import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MediaContentTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    
    console.log('Interceptor - Original body:', body);

    // Transform the request body to handle usageRights properties
    if (body) {
      // If usageRights properties are sent as separate fields, combine them
      if ((body.allowedUses || body.restrictions) && !body.usageRights) {
        body.usageRights = {
          allowedUses: body.allowedUses || [],
          restrictions: body.restrictions || [],
          attribution: body.attribution || false
        };
        
        // Remove the separate properties to avoid validation errors
        delete body.allowedUses;
        delete body.restrictions;
        delete body.attribution;
      }

      // Handle usageRights - it might be a JSON string from FormData
      if (body.usageRights) {
        // If usageRights is a string, try to parse it as JSON
        if (typeof body.usageRights === 'string') {
          try {
            body.usageRights = JSON.parse(body.usageRights);
          } catch (error) {
            console.error('Failed to parse usageRights JSON:', error);
            body.usageRights = { allowedUses: [], restrictions: [], attribution: false };
          }
        }
        
        // Ensure usageRights is properly structured
        if (body.usageRights && typeof body.usageRights === 'object') {
          // Ensure allowedUses and restrictions are arrays
          if (!Array.isArray(body.usageRights.allowedUses)) {
            body.usageRights.allowedUses = body.usageRights.allowedUses ? [body.usageRights.allowedUses] : [];
          }
          if (!Array.isArray(body.usageRights.restrictions)) {
            body.usageRights.restrictions = body.usageRights.restrictions ? [body.usageRights.restrictions] : [];
          }
          
          // Ensure attribution is boolean
          if (typeof body.usageRights.attribution !== 'boolean') {
            body.usageRights.attribution = Boolean(body.usageRights.attribution);
          }
        }
      } else {
        // If usageRights is not provided, don't create a default structure
        // This allows existing data to be preserved during updates
        console.log('No usageRights provided in request body');
      }

      // Handle tags and categories - they might be JSON strings from FormData
      if (body.tags) {
        if (typeof body.tags === 'string') {
          try {
            body.tags = JSON.parse(body.tags);
          } catch (error) {
            console.error('Failed to parse tags JSON:', error);
            body.tags = [];
          }
        }
        if (!Array.isArray(body.tags)) {
          body.tags = [body.tags];
        }
      }
      
      if (body.categories) {
        if (typeof body.categories === 'string') {
          try {
            body.categories = JSON.parse(body.categories);
          } catch (error) {
            console.error('Failed to parse categories JSON:', error);
            body.categories = [];
          }
        }
        if (!Array.isArray(body.categories)) {
          body.categories = [body.categories];
        }
      }

      // Ensure price is a number
      if (body.price) {
        if (typeof body.price === 'string') {
          body.price = parseFloat(body.price);
        }
        if (isNaN(body.price)) {
          body.price = 0;
        }
      }

      console.log('Interceptor - Transformed body:', body);
    }

    return next.handle();
  }
}
